import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Team = {
  id: number;
  name: string;
  org_id: number;
};

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'An unknown error occurred.';

const TeamsListPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const organizationId = Number(orgId);

      if (!orgId || Number.isNaN(organizationId)) {
        setError('Invalid organization ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, org_id')
          .eq('org_id', organizationId)
          .order('name', { ascending: true });

        if (teamsError) {
          throw teamsError;
        }

        setTeams(data ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchTeams();
  }, [orgId]);

  return (
    <div>
      <h2>Teams</h2>

      {orgId && (
        <p>
          <Link to={`/organizations/${orgId}/teams/new`}>Create Team</Link>
        </p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {teams.length === 0 && !loading && !error && <p>No teams found for this organization.</p>}

      {teams.map((team) => (
        <div key={team.id}>
          <h3>
            <Link to={`/organizations/${team.org_id}/teams/${team.id}`}>{team.name}</Link>
          </h3>
        </div>
      ))}
    </div>
  );
};

export default TeamsListPage;
