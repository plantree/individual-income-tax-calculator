import { TaxCalculatorForm } from "@/components/tax-calculator-form";

export default function Home() {
  return (
    <div className="min-h-screen p-6 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">个人所得税计算器</h1>
        <p className="text-muted-foreground">快速计算您的个人所得税，了解税率区间</p>
      </header>
      
      <main className="max-w-4xl mx-auto pb-16">
        <TaxCalculatorForm />
      </main>
      
      <footer className="text-center text-sm text-muted-foreground py-4">
        <p>© {new Date().getFullYear()} 个人所得税计算器 - <a className="hover:underline" href="https://plantree.me" target="_blank">Plantree</a></p>
      </footer>
    </div>
  );
}
