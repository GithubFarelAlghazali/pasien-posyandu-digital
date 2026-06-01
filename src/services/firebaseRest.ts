const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID as string;
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY as string;

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { mapValue: { fields: FirestoreFields } }
  | { arrayValue: { values?: FirestoreValue[] } };

type FirestoreFields = Record<string, FirestoreValue>;

export interface PasienUser {
  id?: string;
  alamat: string;
  email: string;
  nik: string;
  password: string;
  role: 'pasien';
  tanggalLahir: string;
  telp: string;
  username: string;
}

function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === 'object') return { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } };
  return { stringValue: String(value) };
}

function toFirestoreFields(data: Record<string, unknown>): FirestoreFields {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, toFirestoreValue(value)]));
}

function fromFirestoreValue(value: FirestoreValue): any {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('mapValue' in value) return fromFirestoreFields(value.mapValue.fields || {});
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  return null;
}

function fromFirestoreFields(fields: FirestoreFields): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)]));
}

function getDocumentId(name?: string) {
  return name?.split('/').pop();
}

async function requestFirestore(url: string, options?: RequestInit) {
  if (!PROJECT_ID || !API_KEY) {
    throw new Error('Firebase env belum lengkap. Cek VITE_PROJECT_ID dan VITE_API_KEY di file .env.');
  }

  const separator = url.includes('?') ? '&' : '?';
  const response = await fetch(`${url}${separator}key=${API_KEY}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Gagal menghubungi Firebase.');
  }

  return response.json();
}

export async function addDocument<T extends Record<string, unknown>>(collectionName: string, data: T) {
  const result = await requestFirestore(`${FIRESTORE_BASE_URL}/${collectionName}`, {
    method: 'POST',
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });

  return { id: getDocumentId(result.name), ...data };
}

export async function queryDocuments<T>(collectionName: string, field: string, op: 'EQUAL', value: string | number | boolean) {
  const result = await requestFirestore(`${FIRESTORE_BASE_URL}:runQuery`, {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collectionName }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op,
            value: toFirestoreValue(value),
          },
        },
      },
    }),
  });

  return (result || [])
    .filter((item: any) => item.document)
    .map((item: any) => ({
      id: getDocumentId(item.document.name),
      ...fromFirestoreFields(item.document.fields || {}),
    })) as T[];
}

export async function findPasienByLogin(usernameOrEmail: string, password: string) {
  const usersByUsername = await queryDocuments<PasienUser>('users', 'username', 'EQUAL', usernameOrEmail);
  const usersByEmail = await queryDocuments<PasienUser>('users', 'email', 'EQUAL', usernameOrEmail);
  const users = [...usersByUsername, ...usersByEmail];

  return users.find((user) => user.role === 'pasien' && user.password === password) || null;
}

export async function registerPasien(data: PasienUser) {
  const sameNik = await queryDocuments<PasienUser>('users', 'nik', 'EQUAL', data.nik);
  if (sameNik.length > 0) throw new Error('NIK sudah terdaftar.');

  const sameEmail = await queryDocuments<PasienUser>('users', 'email', 'EQUAL', data.email);
  if (sameEmail.length > 0) throw new Error('Email sudah terdaftar.');

  const sameUsername = await queryDocuments<PasienUser>('users', 'username', 'EQUAL', data.username);
  if (sameUsername.length > 0) throw new Error('Username sudah terdaftar.');

  const user = await addDocument('users', data);

  return user;
}

export async function getHealthRecordByNik(nik: string) {
  const records = await queryDocuments<HealthRecord>('healthRecords', 'nik', 'EQUAL', nik);
  return records[0] || null;
}
