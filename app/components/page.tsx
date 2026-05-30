import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'

import { Badge as ShadcnBadge } from '~/components/ui/badge'
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
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
    <div className="mb-6 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <ShadcnCard className={cn('bg-card/95 shadow-sm', className)}>{children}</ShadcnCard>
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <CardHeader className="border-b pb-4">
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  )
}

export function SectionContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <CardContent className={cn('pt-0', className)}>{children}</CardContent>
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <CardContent className={cn(className)}>{children}</CardContent>
}

export function StatCard({
  label,
  value,
  tone = 'blue',
}: {
  label: string
  value: ReactNode
  tone?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose'
}) {
  const tones = {
    blue: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
    emerald: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300',
    violet: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
    rose: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300',
  }

  return (
    <ShadcnCard className="shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <strong className="mt-2 block text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </strong>
        </div>
        <span className={cn('size-2.5 rounded-full ring-4', tones[tone])} />
      </CardContent>
    </ShadcnCard>
  )
}

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-xl border bg-card">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="px-4 text-xs uppercase tracking-wide text-muted-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <TableCell className={cn('px-4 py-3 text-sm text-muted-foreground', className)}>
      {children}
    </TableCell>
  )
}

export function Badge({
  children,
  tone = 'slate',
}: {
  children: ReactNode
  tone?: 'slate' | 'green' | 'amber' | 'red' | 'blue'
}) {
  const tones = {
    slate: 'border-border bg-muted text-muted-foreground',
    green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    red: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  }

  return (
    <ShadcnBadge variant="outline" className={cn('gap-1', tones[tone])}>
      {children}
    </ShadcnBadge>
  )
}

export function TextInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn('h-9 bg-background', props.className)} />
}

export function SelectInput({
  children,
  placeholder = '请选择',
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  const options = Children.toArray(children).filter(isValidElement) as ReactElement<
    React.OptionHTMLAttributes<HTMLOptionElement>
  >[]
  const defaultOption =
    options.find((option) => option.props.value === undefined || option.props.value === '') ??
    options[0]

  return (
    <Select
      defaultValue={String(defaultOption?.props.value ?? defaultOption?.props.children ?? '')}
      name={props.name}
      required={props.required}
      disabled={props.disabled}
    >
      <SelectTrigger className={cn('h-9 w-full bg-background', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => {
          const value = String(option.props.value ?? option.props.children ?? index)
          return (
            <SelectItem key={`${value}-${index}`} value={value}>
              {option.props.children}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <form className="mx-4 mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</form>
}

export { TableCell, TableRow }
