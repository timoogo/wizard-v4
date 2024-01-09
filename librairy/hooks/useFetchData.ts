type FetchEntityResponse<T> = {
    data?: T;
    error?: unknown;
};

export async function useFetchEntityData<T>(entityType: string, queryParam: 'all' | 'one', id?: number): Promise<FetchEntityResponse<T>> {
    try {
        let data: T;

        if (queryParam === 'all') {
            data = await prisma[entityType].findMany() as unknown as T;
        } else if (queryParam === 'one' && id !== undefined) {
            data = await prisma[entityType].findUnique({ where: { id } }) as unknown as T;
        } else {
            throw new Error("Invalid query parameters");
        }

        return { data };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error };
    }
}
