import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { UserProvider } from "./context/UserContext";
import { useAuth } from "./context/AuthContext"; // Mengimpor detektor sesi resmi

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

// Komponen Guard: Melindungi seluruh halaman internal agar tidak bisa diakses tanpa login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#fff4fa]">
				<p className="text-[#e6007e] font-bold animate-pulse text-lg">Menyelaraskan Sesi Pasien...</p>
			</div>
		);
	}

	// Jika tidak ada user terpantau di Firebase Auth SDK, tendang kembali ke login
	return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Komponen Guard Khusus Tamu: Mencegah user yang sudah login untuk kembali ke halaman login/register
function PublicRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) return null;

	// Jika sudah login, arahkan otomatis ke halaman utama dashboard pasien
	return !user ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#fff4fa]">
				<p className="text-[#e6007e] font-bold animate-pulse text-lg">Memuat Aplikasi...</p>
			</div>
		);
	}

	return (
		<AnimatePresence mode="wait">
			<Routes>
				{/* Rute Utama Dashboard Pasien - Dilindungi Guard */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<AdultDashboardPage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>

				{/* Rute Otentikasi Gateway - Dilindungi PublicRoute */}
				<Route
					path="/login"
					element={
						<PublicRoute>
							<LoginPasienPage />
						</PublicRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<PublicRoute>
							<RegisterPasienPage />
						</PublicRoute>
					}
				/>

				{/* Seluruh Rute Fitur Internal Pasien Wajib Melewati Guard Keamanan */}
				<Route
					path="/schedule"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<SchedulePage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/history"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<HistoryPage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/education"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<EducationPage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/feedback"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<FeedbackPage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/kids-adventure"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<HomePage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/onboarding"
					element={
						<ProtectedRoute>
							<OnboardingPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/story"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<StoryPage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/quiz"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<QuizPage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<MobileLayout>
								<ProfilePage />
							</MobileLayout>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/game/tebak-makanan-sehat"
					element={
						<ProtectedRoute>
							<TebakMakananSehatPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/game/puzzle-gizi-seimbang"
					element={
						<ProtectedRoute>
							<PuzzleGiziSeimbangPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/game/quiz-imunisasi"
					element={
						<ProtectedRoute>
							<QuizImunisasiPage />
						</ProtectedRoute>
					}
				/>

				{/* Fallback Rute Tidak Dikenal */}
				<Route path="*" element={<Navigate to="/" replace />} />
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
