import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import { EMPTY_PROFILE } from "./constants";
import { parseStoredField, serializeField } from "./profileUtils";

export default function useProfile(user) {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) loadProfile();
    else {
      setProfile(EMPTY_PROFILE);
      setSaveMessage("");
    }
    // eslint-disable-next-line
  }, [user]);

  async function loadProfile() {
    setProfileLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return setProfileLoading(false);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      setSaveMessage("Profil konnte nicht geladen werden.");
    } else if (data) {
      setProfile({
        ...data,
        strengths: parseStoredField(data.strengths),
        work_style: parseStoredField(data.work_style),
        needs: parseStoredField(data.needs),
        skills: parseStoredField(data.skills),
      });
    }

    setProfileLoading(false);
  }

  async function saveProfile() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    await supabase.from("profiles").upsert({
      ...profile,
      id: currentUser.id,
      strengths: serializeField(profile.strengths),
      work_style: serializeField(profile.work_style),
      needs: serializeField(profile.needs),
      skills: serializeField(profile.skills),
    });

    setSaveMessage("✓ Profil gespeichert!");
  }

  function copyProfileLink() {
    const url = `${window.location.origin}/profil/${user.id}`;
    navigator.clipboard.writeText(url);
    setCopyMessage("✓ Link kopiert!");
    setTimeout(() => setCopyMessage(""), 3000);
  }

  return {
    profile,
    setProfile,
    profileLoading,
    saveMessage,
    avatarUploading,
    copyMessage,
    fileInputRef,
    saveProfile,
    copyProfileLink
  };
}