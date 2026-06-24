import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

interface RouterWrapperProps {
  children: ReactNode;
  initialEntries?: MemoryRouterProps['initialEntries'];
}

export function RouterWrapper({
  children,
  initialEntries = ['/'],
}: RouterWrapperProps) {
  return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
}

export function renderWithRouter(
  ui: ReactElement,
  {
    route = '/',
    ...options
  }: RenderOptions & { route?: string } = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <RouterWrapper initialEntries={[route]}>{children}</RouterWrapper>
    ),
    ...options,
  });
}
