import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Edit, Check, X } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  
  // États pour l'édition des champs
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialiser les valeurs des champs d'après l'utilisateur authentifié
  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Fonction pour enregistrer les modifications du nom
  const saveFullName = async () => {
    if (!fullName.trim()) {
      setErrorMessage("Le nom complet ne peut pas être vide");
      return;
    }
    
    try {
      setIsSaving(true);
      await updateProfile({ fullName });
      setIsEditingName(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour du nom: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour enregistrer les modifications de l'email
  const saveEmail = async () => {
    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Veuillez saisir une adresse email valide");
      return;
    }
    
    try {
      setIsSaving(true);
      await updateProfile({ email });
      setIsEditingEmail(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour de l'email: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Annuler les modifications
  const cancelEditing = (field) => {
    if (field === 'name') {
      setIsEditingName(false);
      setFullName(authUser.fullName || "");
    } else if (field === 'email') {
      setIsEditingEmail(false);
      setEmail(authUser.email || "");
    }
    setErrorMessage("");
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Afficher les messages d'erreur */}
          {errorMessage && (
            <div className="alert alert-error">
              <p>{errorMessage}</p>
            </div>
          )}
          
          {/* Champs modifiables */}  
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow"
                    placeholder="Enter your full name"
                    disabled={isSaving}
                  />
                  <button 
                    onClick={saveFullName} 
                    disabled={isSaving}
                    className="btn btn-circle btn-sm btn-success"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => cancelEditing('name')} 
                    className="btn btn-circle btn-sm btn-error"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow">
                    {authUser?.fullName}
                  </p>
                  <button 
                    onClick={() => setIsEditingName(true)} 
                    className="ml-2 btn btn-circle btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              
              {isEditingEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow"
                    placeholder="Enter your email address"
                    disabled={isSaving}
                  />
                  <button 
                    onClick={saveEmail} 
                    disabled={isSaving}
                    className="btn btn-circle btn-sm btn-success"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => cancelEditing('email')} 
                    className="btn btn-circle btn-sm btn-error"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow">
                    {authUser?.email}
                  </p>
                  <button 
                    onClick={() => setIsEditingEmail(true)} 
                    className="ml-2 btn btn-circle btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
