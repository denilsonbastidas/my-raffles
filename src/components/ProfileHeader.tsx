interface Props {
  email: string;
  picture: string;
}

function ProfileHeader({ email, picture }: Props) {
  return (
    <section className="flex items-center gap-2 flex-wrap">
      <img
        src={picture}
        className="rounded-full w-14 h-14 border-2 border-gray-300"
        alt="user image"
      />
      <h3 className="text-base font-semibold text-gray-200">{email}</h3>
    </section>
  );
}

export default ProfileHeader;
