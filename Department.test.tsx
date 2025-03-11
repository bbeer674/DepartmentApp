import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Department from './src/scenes/Department';

const mockDepartmentService = {
  DepartmentCarousel: jest.fn().mockResolvedValue({
    status: 200,
    data: [
      {
        id: '1',
        name: 'Electronics',
        imageUrl: 'https://example.com/electronics.jpg',
      },
      {id: '2', name: 'Clothing', imageUrl: 'https://example.com/clothing.jpg'},
    ],
  }),
  ProductListing: jest.fn().mockResolvedValue({
    status: 200,
    data: [
      {
        id: '101',
        name: 'Laptop',
        imageUrl: 'https://example.com/laptop.jpg',
        desc: 'High-end laptop',
        price: '1000$',
        departmentId: '1',
      },
      {
        id: '102',
        name: 'T-shirt',
        imageUrl: 'https://example.com/tshirt.jpg',
        desc: 'Cool T-shirt',
        price: '20$',
        departmentId: '2',
      },
    ],
  }),
};

describe('Department Component', () => {
  it('renders the Department component and loads data', async () => {
    const {getByText} = render(
      <Department departmentService={mockDepartmentService} />,
    );

    await waitFor(() =>
      expect(mockDepartmentService.DepartmentCarousel).toHaveBeenCalled(),
    );

    expect(getByText('Department Carousel')).toBeTruthy();
    expect(getByText('Electronics')).toBeTruthy();
    expect(getByText('Clothing')).toBeTruthy();
  });

  it('fetches and displays products on department click', async () => {
    const {getByText} = render(
      <Department departmentService={mockDepartmentService} />,
    );

    await waitFor(() =>
      expect(mockDepartmentService.DepartmentCarousel).toHaveBeenCalled(),
    );

    fireEvent.press(getByText('Electronics'));

    await waitFor(() =>
      expect(mockDepartmentService.ProductListing).toHaveBeenCalledWith('1'),
    );

    expect(getByText('Laptop')).toBeTruthy();
    expect(getByText('1000$')).toBeTruthy();
  });

  it('opens the modal when clicking on a product', async () => {
    const {getByText} = render(
      <Department departmentService={mockDepartmentService} />,
    );

    await waitFor(() =>
      expect(mockDepartmentService.DepartmentCarousel).toHaveBeenCalled(),
    );
    await waitFor(() =>
      expect(mockDepartmentService.ProductListing).toHaveBeenCalledWith('1'),
    );

    fireEvent.press(getByText('Laptop'));

    expect(getByText('Product Description')).toBeTruthy();
    expect(getByText('High-end laptop')).toBeTruthy();

    fireEvent.press(getByText('Close'));

    expect(getByText('Product Description')).not.toBeTruthy();
  });
});
