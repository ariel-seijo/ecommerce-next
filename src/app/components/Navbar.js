import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-black text-white p-4 flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/products">Productos</Link>
            <Link href="/cart">Carrito</Link>
        </nav>
    );
}