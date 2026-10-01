export type Pass = {
  id: number;
  name: string;
  price: string;
  terms?: string[];
  isActive?: boolean | null;
};
