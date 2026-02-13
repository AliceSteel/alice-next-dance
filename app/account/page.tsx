import { SignIn } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="page-container pt-24">
      <SignIn />
    </div>
  );
}
