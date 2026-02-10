import { render, screen } from '@testing-library/react'
import { PaymentsTable } from '@/components/payments/payments-table'
import type { Payment } from '@/lib/types'

// Mock the child components
jest.mock('@/components/payments/payment-filters', () => ({
  PaymentFilters: ({ onFiltersChange, onReset, activeFiltersCount }: any) => (
    <div data-testid="payment-filters">
      <button onClick={onReset}>Reset Filters ({activeFiltersCount})</button>
      <button onClick={() => onFiltersChange({ search: 'test' })}>Set Filter</button>
    </div>
  ),
}))

jest.mock('@/components/ui/status-badge', () => ({
  PaymentStatusBadge: ({ status }: any) => <span data-testid="payment-status">{status}</span>,
  PlanBadge: ({ plan }: any) => <span data-testid="plan-badge">{plan}</span>,
}))

jest.mock('@/lib/calculate', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
  formatDate: (date: string) => '2023-01-01',
}))

const mockPayments: Payment[] = [
  {
    id: 'payment1',
    amount: 100,
    clientId: 'client1',
    companyId: 'company1',
    createdAt: new Date('2023-01-01'),
    paidAt: new Date('2023-01-01'),
    method: 'TRANSFER',
    status: 'PAID',
    client: {
      id: 'client1',
      name: 'Test Client',
      email: 'test@example.com',
      phone: '123456789',
      status: 'ACTIVE',
      companyId: 'company1',
      planId: 'plan1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      plan: {
        id: 'plan1',
        name: 'Basic',
        price: 100,
        interval: 'monthly',
        companyId: 'company1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
      company: {
        id: 'company1',
        name: 'Test Company',
        slug: 'test-company',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    },
  },
  {
    id: 'payment2',
    amount: 200,
    clientId: 'client2',
    companyId: 'company1',
    createdAt: new Date('2023-01-02'),
    paidAt: null,
    method: 'CASH',
    status: 'PENDING',
    client: {
      id: 'client2',
      name: 'Another Client',
      email: 'another@example.com',
      phone: '987654321',
      status: 'PENDING',
      companyId: 'company1',
      planId: 'plan2',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      plan: {
        id: 'plan2',
        name: 'Pro',
        price: 200,
        interval: 'monthly',
        companyId: 'company1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
      company: {
        id: 'company1',
        name: 'Test Company',
        slug: 'test-company',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    },
  },
]

describe('PaymentsTable', () => {
  it('should render payments table with data', () => {
    render(<PaymentsTable payments={mockPayments} />)

    expect(screen.getByText('Test Client')).toBeInTheDocument()
    expect(screen.getByText('another@example.com')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
    expect(screen.getByText('PAID')).toBeInTheDocument()
    expect(screen.getByText('PENDING')).toBeInTheDocument()
  })

  it('should render payment filters', () => {
    render(<PaymentsTable payments={mockPayments} />)

    expect(screen.getByTestId('payment-filters')).toBeInTheDocument()
    expect(screen.getByText('Reset Filters (0)')).toBeInTheDocument()
    expect(screen.getByText('Set Filter')).toBeInTheDocument()
  })

  it('should show loading skeleton when loading', () => {
    render(<PaymentsTable payments={[]} isLoading={true} />)

    // Should show skeleton instead of table content
    expect(screen.queryByText('Test Client')).not.toBeInTheDocument()
    expect(screen.queryByText('No payments found')).not.toBeInTheDocument()
  })

  it('should show empty state when no payments', () => {
    render(<PaymentsTable payments={[]} />)

    expect(screen.getByText('No payments found')).toBeInTheDocument()
  })

  it('should show correct table headers', () => {
    render(<PaymentsTable payments={mockPayments} />)

    expect(screen.getByText('Cliente')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Monto')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Método')).toBeInTheDocument()
  })

  it('should display payment method labels correctly', () => {
    render(<PaymentsTable payments={mockPayments} />)

    // Check that payment methods are displayed (they should be translated)
    expect(screen.getByText('Transferencia')).toBeInTheDocument()
    expect(screen.getByText('Efectivo')).toBeInTheDocument()
  })

  it('should format currency correctly', () => {
    render(<PaymentsTable payments={mockPayments} />)

    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
  })

  it('should show pagination when there are many payments', () => {
    const manyPayments = Array.from({ length: 25 }, (_, i) => ({
      ...mockPayments[0],
      id: `payment${i}`,
      client: { ...mockPayments[0].client, name: `Client ${i}` },
    }))

    render(<PaymentsTable payments={manyPayments} />)

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('should not show pagination when there are few payments', () => {
    render(<PaymentsTable payments={mockPayments} />)

    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
  })

  it('should show total results count', () => {
    render(<PaymentsTable payments={mockPayments} />)

    expect(screen.getByText('Showing 2 of 2 payments')).toBeInTheDocument()
  })

  it('should handle filtering', async () => {
    render(<PaymentsTable payments={mockPayments} />)

    const setFilterButton = screen.getByText('Set Filter')
    
    // Click to set a filter
    setFilterButton.click()

    // After setting filter, should update results count
    // This would be tested more thoroughly with actual filtering logic
  })

  it('should handle filter reset', async () => {
    render(<PaymentsTable payments={mockPayments} />)

    const resetButton = screen.getByText('Reset Filters (0)')
    
    // Click to reset filters
    resetButton.click()

    // Should still show all payments since we started with no active filters
    expect(screen.getByText('Showing 2 of 2 payments')).toBeInTheDocument()
  })
})