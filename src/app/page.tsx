import { redirect } from 'next/navigation';

// This page only renders when the user visits the exact URL "/"
export default function RootPage() {
  // Redirect to Ukrainian locale by default
  redirect('/ua');
}