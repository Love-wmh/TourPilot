import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/60 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
        </div>
        {action}
      </div>
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur', className)}>
      {children}
    </section>
  )
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
    </div>
  )
}

export function StatCard({ label, value, tone = 'blue' }: { label: string; value: ReactNode; tone?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' }) {
  const tones = {
    blue: 'from-blue-500 to-cyan-400',
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-orange-400',
    violet: 'from-violet-500 to-fuchsia-400',
    rose: 'from-rose-500 to-pink-400',
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className={cn('absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br opacity-20 blur-sm', tones[tone])} />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <strong className="mt-3 block text-3xl font-semibold tracking-tight text-slate-950">{value}</strong>
    </div>
  )
}

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'green' | 'amber' | 'red' | 'blue' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  }

  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1', tones[tone])}>{children}</span>
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn('h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70', props.className)} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn('h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70', props.className)} />
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <form className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</form>
}
