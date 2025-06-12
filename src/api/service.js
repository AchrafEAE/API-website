export const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

export const fetchMultipleData = async (urls) => {
    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }));
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};