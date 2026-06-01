/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { UserProvider } from "./context/UserContext";
import { auth, db } from "./services/firebase/config"; // Pastikan path config Firebase SDK kamu sudah tepat
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Import Halaman Pasien
import AdultDashboardPage from "./components/pages/AdultDashboardPage";
import OnboardingPage from "./components/pages/OnboardingPage";
import HomePage from "./components/pages/HomePage";
import ProfilePage from "./components/pages/ProfilePage";
import StoryPage from "./components/pages/StoryPage";
import QuizPage from "./components/pages/QuizPage";
import SchedulePage from "./components/pages/SchedulePage";
import EducationPage from "./components/pages/EducationPage";
import HistoryPage from "./components/pages/HistoryPage";
import FeedbackPage from "./components/pages/FeedbackPage";
import MobileLayout from "./components/templates/MobileLayout";
import TebakMakananSehatPage from "./components/pages/TebakMakananSehatPage";
import PuzzleGiziSeimbangPage from "./components/pages/PuzzleGiziSeimbangPage";
import QuizImunisasiPage from "./components/pages/QuizImunisasiPage";
import LoginPasienPage from "./components/pages/LoginPasienPage";
import RegisterPasienPage from "./components/pages/RegisterPasienPage";

// Komponen Guard Keamanan: Mengunci Rute Pasien agar tidak bisa ditembak sembarangan
function ProtectedPasienRoute({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				// Ambil profil data dari firestore untuk verifikasi role murni pasien
				const docSnap = await getDoc(doc(db, "users", currentUser.uid));
				if (docSnap.exists() && docSnap.data().role === "pasien") {
					setUser(currentUser);
				} else {
					setUser(null);
				}
			} else {
				setUser(null);
			}
			setChecking(false);
		});

		return () => unsubscribe();
	}, []);

	if (checking) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-pink-50">
				<p className="text-pink-600 font-bold animate-pulse">Menyelaraskan Sesi Pasien...</p>
			</div>
		);
	}

	return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
	return (
		<AnimatePresence mode="wait">
			<Routes>
				{/* Rute Otomatis Root: Langsung arahkan ke login atau dashboard pasien */}
				<Route path="/" element={<Navigate to="/pasien" replace />} />

				{/* Rute Autentikasi */}
				<Route path="/login" element={<LoginPasienPage />} />
				<Route path="/register" element={<RegisterPasienPage />} />

				{/* Rute Utama Dashboard Pasien Terproteksi Firebase SDK */}
				<Route
					path="/pasien"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<AdultDashboardPage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>

				{/* Rute Fitur Tambahan Pasien */}
				<Route
					path="/schedule"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<SchedulePage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/history"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<HistoryPage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/education"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<EducationPage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/feedback"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<FeedbackPage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>

				{/* Rute Edukasi & Game Anak */}
				<Route
					path="/kids-adventure"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<HomePage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/onboarding"
					element={
						<ProtectedPasienRoute>
							<OnboardingPage />
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/story"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<StoryPage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/quiz"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<QuizPage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedPasienRoute>
							<MobileLayout>
								<ProfilePage />
							</MobileLayout>
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/game/tebak-makanan-sehat"
					element={
						<ProtectedPasienRoute>
							<TebakMakananSehatPage />
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/game/puzzle-gizi-seimbang"
					element={
						<ProtectedPasienRoute>
							<PuzzleGiziSeimbangPage />
						</ProtectedPasienRoute>
					}
				/>
				<Route
					path="/game/quiz-imunisasi"
					element={
						<ProtectedPasienRoute>
							<QuizImunisasiPage />
						</ProtectedPasienRoute>
					}
				/>

				{/* Fallback Rute Tidak Dikenal */}
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</AnimatePresence>
	);
}

export default function App() {
	return (
		<UserProvider>
			<Router>
				<AppRoutes />
			</Router>
		</UserProvider>
	);
}
