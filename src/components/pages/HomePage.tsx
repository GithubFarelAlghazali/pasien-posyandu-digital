import { useNavigate } from "react-router-dom";
import { Play, RotateCcw, User, LogOut } from "lucide-react";
import { useUser } from "@/src/context/UserContext";
import Button from "@/src/components/atoms/Button";

export default function HomePage() {
	const navigate = useNavigate();
	const { profile } = useUser();

	return (
		<div className="flex flex-col items-center p-8 min-h-screen">
			{/* Header with Icon */}
			<div className="w-24 h-24 bg-bg-pink rounded-full flex items-center justify-center mb-8 border-2 border-white shadow-inner">
				<span className="text-4xl text-secondary-pink">🩺</span>
			</div>

			<div className="text-center mb-12">
				<h1 className="text-4xl font-black text-black leading-tight italic">Petualangan</h1>
				<h2 className="text-4xl font-black text-primary-pink leading-tight">Penjaga Sehat</h2>
			</div>

			<div className="text-accent-pink font-bold mb-12">Hallo, {profile.name}...</div>

			<div className="w-full space-y-6">
				<Button onClick={() => navigate("/onboarding")}>
					<div className="w-10 h-10 bg-secondary-pink/20 rounded-full flex items-center justify-center mr-2">
						<Play className="fill-white text-white w-5 h-5 ml-1" />
					</div>
					MULAI
				</Button>

				<Button variant="outline" className="text-gray-700" onClick={() => navigate("/story")}>
					<RotateCcw className="w-6 h-6 mr-2 opacity-30" />
					LANJUTKAN
				</Button>

				<Button variant="outline" className="text-gray-700" onClick={() => navigate("/profile")}>
					<div className="w-10 h-10 border border-primary-pink/30 rounded-xl flex items-center justify-center mr-2">
						<User className="text-primary-pink w-6 h-6" />
					</div>
					PROFIL & SKOR
				</Button>

				<Button variant="outline" className="text-gray-700" onClick={() => window.location.reload()}>
					<LogOut className="text-primary-pink w-6 h-6 mr-2 rotate-180" />
					KELUAR GAME
				</Button>
			</div>
		</div>
	);
}
