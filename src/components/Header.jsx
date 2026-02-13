export default function Header() {
  return (
    <header className="bg-black text-white px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-yellow-400">Billing Bee</h1>

      <nav className="space-x-6 text-sm">
        <span className="cursor-pointer hover:text-yellow-400">Products</span>
        <span className="cursor-pointer hover:text-yellow-400">Billing</span>
        <span className="cursor-pointer hover:text-yellow-400">Reports</span>
      </nav>
    </header>
  );
}
