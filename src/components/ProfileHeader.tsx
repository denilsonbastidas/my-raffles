interface Props {
  email: string;
  picture: string;
}

function ProfileHeader({ email, picture }: Props) {
  return (
    <section className="flex flex-wrap items-center gap-2">
      <img
        src={picture}
        className="h-14 w-14 rounded-full border-2 border-gray-300"
        alt="user"
      />
      <h3 className="text-base font-semibold text-gray-200">{email}</h3>
    </section>
  );
}

export default ProfileHeader;
