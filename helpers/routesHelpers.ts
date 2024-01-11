const getFrontendBaseURL = () => {
    const host = process.env.NEXT_PUBLIC_FRONTEND_HOST;
    const port = process.env.NEXT_PUBLIC_FRONTEND_PORT;
    return `${host}:${port}`;
};

const getAPIBaseURL = () => {
    const host = process.env.NEXT_PUBLIC_API_HOST;
    const port = process.env.NEXT_PUBLIC_API_PORT;
    return `${host}:${port}`;
};

const getAPIURL = (path: string) => {
    const baseURL = getAPIBaseURL();
    return `${baseURL}${path}`;
};

const getReadURLFor = (model: string, id: number) => {
    return `${getFrontendBaseURL()}/${model}/read/${id}`;
};

const getEditURLFor = (model: string, id: number) => {
    return `${getFrontendBaseURL()}/${model}/edit/${id}`;
};

const getCreateURLFor = (model: string) => {
    return `${getFrontendBaseURL()}/${model}/create`;
}

const getDeleteURLFor = (model: string, id: number) => {
    return `${getAPIBaseURL()}/api/${model}/delete/${id}`;
};

export {
    getFrontendBaseURL,
    getAPIBaseURL,
    getAPIURL,
    getCreateURLFor,    
    getReadURLFor,
    getEditURLFor,
    getDeleteURLFor
};
