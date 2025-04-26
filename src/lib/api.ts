export const getCustomers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  };
  