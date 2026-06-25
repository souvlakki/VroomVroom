import { useState } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateTeamPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('teams')
        .insert([{ name, org_id: parseInt(orgId) }])
        .select();

      if (error) throw error;

      // Redirect or show success message
      navigate(`/organizations/${orgId}/teams`);
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
        placeholder="Team Name"
        required
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default CreateTeamPage;
