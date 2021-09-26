export default async function fetcher(...args) {
  try {
    const response = await fetch(...args);
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    const error = new Error(response.statusText);
    error.response = response;
    error.data = data;
    throw error;
  } catch (error) {
		if(error.message === 'Failed to fetch' && args[0] === '/api/search') return { data: null, override: true };

    if (!error.data) {
      error.data = { message: error.message }
    }
    throw error;
  };
};