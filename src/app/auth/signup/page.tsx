import { redirect } from 'next/navigation';

// Self-service signup has been removed: membership is granted by an exec who
// issues a login code. Anyone hitting this route is sent to the sign-in page.
export default function SignupPage() {
  redirect('/auth/login');
}
