import { useRouter } from 'next/router';
import Link from "next/link";

export default function SuccessPage() {
    const router = useRouter();
    const { entityName } = router.query;

    return (
        <div>
            <h1>Success Page for {entityName}</h1>
            <Link href="/">
                Back to home</Link>
        </div>
    );
}