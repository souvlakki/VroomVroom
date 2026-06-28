import { type FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Team = {
  id: number;
  name: string;
  org_id: number;
};

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'An unknown error occurred.';

const CreateTeamPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const organizationId = Number(orgId);
    const trimmedName = name.trim();

    if (!orgId || Number.isNaN(organizationId)) {
      setError('Invalid organization ID.');
      return;
    }

    if (!trimmedName) {
      setError('Team name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('User not authenticated.');
      }

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{ name: trimmedName, org_id: organizationId }])
        .select('id, name, org_id')
        .single<Team>();

      if (teamError) {
        throw teamError;
      }

      const { error: membershipError } = await supabase
        .from('team_members')
        .insert([
          {
            user_id: user.id,
            team_id: team.id,
            role: 'admin',
          },
        ]);

      if (membershipError) {
        throw membershipError;
      }

      navigate(`/organizations/${organizationId}/teams/${team.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
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
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  );
};

export default CreateTeamPage;
