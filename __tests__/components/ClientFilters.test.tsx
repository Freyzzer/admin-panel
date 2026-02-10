import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientFilters } from '@/components/clients/client-filters'
import type { ClientFiltersState } from '@/components/clients/client-filters'

describe('ClientFilters', () => {
  const mockOnFiltersChange = jest.fn()
  const mockOnReset = jest.fn()

  const initialFilters: ClientFiltersState = {
    search: '',
    status: 'all',
    planId: 'all',
    registrationDateRange: { from: '', to: '' },
    planPriceRange: { min: '', max: '' },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all filter inputs', () => {
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={0}
      />
    )

    expect(screen.getByPlaceholderText('Buscar por nombre, email...')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Todos los planes')).toBeInTheDocument()
  })

  it('should call onFiltersChange when search input changes', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={0}
      />
    )

    const searchInput = screen.getByPlaceholderText('Buscar por nombre, email...')
    await user.type(searchInput, 'test search')

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      search: 'test search',
    })
  })

  it('should call onFiltersChange when status changes', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={0}
      />
    )

    const statusSelect = screen.getByText('Estado')
    await user.click(statusSelect)
    
    const activeOption = screen.getByText('Activo')
    await user.click(activeOption)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      status: 'ACTIVE',
    })
  })

  it('should show advanced filters when button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={2}
      />
    )

    const advancedFiltersButton = screen.getByText('Más filtros')
    await user.click(advancedFiltersButton)

    expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument()
    expect(screen.getByText('Fecha de Registro')).toBeInTheDocument()
    expect(screen.getByText('Rango de Precios del Plan')).toBeInTheDocument()
  })

  it('should show active filters badge when filters are applied', () => {
    render(
      <ClientFilters
        filters={{
          ...initialFilters,
          search: 'test',
          status: 'ACTIVE',
        }}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={2}
      />
    )

    const badge = screen.getByText('2')
    expect(badge).toBeInTheDocument()
  })

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={2}
      />
    )

    const advancedFiltersButton = screen.getByText('Más filtros')
    await user.click(advancedFiltersButton)

    const resetButton = screen.getByText('Limpiar todos')
    await user.click(resetButton)

    expect(mockOnReset).toHaveBeenCalled()
  })

  it('should show active filter badges', () => {
    render(
      <ClientFilters
        filters={{
          search: 'test',
          status: 'ACTIVE',
          planId: 'plan1',
          registrationDateRange: { from: '2023-01-01', to: '' },
          planPriceRange: { min: '100', max: '' },
        }}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={5}
      />
    )

    expect(screen.getByText('Búsqueda')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
    expect(screen.getByText('Fechas')).toBeInTheDocument()
    expect(screen.getByText('Precio')).toBeInTheDocument()
  })

  it('should clear individual filter when X button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={{
          ...initialFilters,
          search: 'test search',
        }}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={1}
      />
    )

    const clearButton = screen.getByRole('button', { name: '' }) // X button
    await user.click(clearButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      search: '',
    })
  })

  it('should handle date range changes', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={0}
      />
    )

    const advancedFiltersButton = screen.getByText('Más filtros')
    await user.click(advancedFiltersButton)

    const fromDateInput = screen.getByPlaceholderText('Desde')
    await user.type(fromDateInput, '2023-01-01')

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      registrationDateRange: {
        ...initialFilters.registrationDateRange,
        from: '2023-01-01',
      },
    })
  })

  it('should handle price range changes', async () => {
    const user = userEvent.setup()
    
    render(
      <ClientFilters
        filters={initialFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        activeFiltersCount={0}
      />
    )

    const advancedFiltersButton = screen.getByText('Más filtros')
    await user.click(advancedFiltersButton)

    const minPriceInput = screen.getByPlaceholderText('Min $')
    await user.type(minPriceInput, '100')

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      planPriceRange: {
        ...initialFilters.planPriceRange,
        min: '100',
      },
    })
  })
})