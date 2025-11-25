export const singleMock = jest.fn();
export const eqMock = jest.fn(() => ({ single: singleMock }));
export const selectMock = jest.fn(() => ({ eq: eqMock }));
export const fromMock = jest.fn(() => ({ select: selectMock }));

export const supabase = {
  from: fromMock,
};
