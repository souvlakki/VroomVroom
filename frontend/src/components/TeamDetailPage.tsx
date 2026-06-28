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

const TeamDetailPage = () => {
  const { orgId, teamId } = useParams<{ orgId: string; teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const organizationId = Number(orgId);
      const parsedTeamId = Number(teamId);

      if (!orgId || Number.isNaN(organizationId)) {
        setError('Invalid organization ID.');
        setLoading(false);
        return;
      }

      if (!teamId || Number.isNaN(parsedTeamId)) {
        setError('Invalid team ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: teamError } = await supabase
          .from('teams')
          .select('id, name, org_id')
          .eq('id', parsedTeamId)
          .eq('org_id', organizationId)
          .single<Team>();

        if (teamError) {
          throw teamError;
        }

        setTeam(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchTeamDetails();
  }, [orgId, teamId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!team && !loading && !error && <p>Team not found.</p>}

      {team && (
        <>
          <p>
            <Link to={`/organizations/${team.org_id}`}>Back to Organization</Link>
          </p>

          <h2>{team.name}</h2>
        </>
      )}
    </div>
  );
};

export default TeamDetailPage;
