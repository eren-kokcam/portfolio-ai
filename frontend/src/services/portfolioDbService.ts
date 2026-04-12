import { supabase } from './supabaseClient';

const savePortfolio = async (portfolioData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('portfolios')
        .insert({ user_id: user.id, name: portfolioData.name})
        .select()
        .single();

    if (error) {
        console.error('Error saving portfolio:', error);
        throw error;
    }

    return data;
}

const savePortfolioItems = async (portfolioId: string, items: any[]) => {
    const { data, error } = await supabase
        .from('portfolio_items')
        .insert(items.map(({ id, portfolio_id, ...rest }) => ({ 
            ...rest, 
            portfolio_id: portfolioId 
        })));

    if (error) {
        console.error('Error saving portfolio items:', error);
        throw error;
    }

    return data;
}

const saveFullPortfolio = async (name: string, items: any[]) => {
    const portfolio = await savePortfolio({ name });

    await savePortfolioItems(portfolio.id, items);
    return portfolio;
}

const getPortfolios = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('portfolios')
        .select(`*, portfolio_items (*)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

const deletePortfolio = async (portfolioId: string) => {
    const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

    if (error) throw error;
};

const saveSnapshot = async (totalValue: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
        .from('portfolio_snapshots')
        .insert({ user_id: user.id, total_value: totalValue });

    if (error) throw error;
};

const getSnapshots = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('portfolio_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
};

export const portfolioDbService = {
    savePortfolio,
    saveFullPortfolio,
    getPortfolios,
    deletePortfolio,
    saveSnapshot,
    getSnapshots,
}