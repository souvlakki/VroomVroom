import { useState } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-react';

const CreateOrganizationPage = () => {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await supabaseClient.auth.user();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabaseClient
        .from('organizations')
        .insert([{ name }])
        .select();

      if (error) throw error;

      await supabaseClient
        .from('organization_members')
        .insert([
          {
            user_id: user.id,
            org_id: data[0].id,
            role: 'admin',
          },
        ]);

      // Redirect or show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Organization Name"
        required
      />
      <button type="submit">Create Organization</button>
    </form>
  );
};

export default CreateOrganizationPage;
