import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Organization = {
  id: number;
  name: string;
};

type Team = {
  id: number;
  name: string;
  org_id: number;
};

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'An unknown error occurred.';

const OrganizationDetailPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      const organizationId = Number(orgId);

      if (!orgId || Number.isNaN(organizationId)) {
        setError('Invalid organization ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('id', organizationId)
          .single<Organization>();

        if (orgError) {
          throw orgError;
        }

        setOrganization(orgData);

        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, org_id')
          .eq('org_id', organizationId)
          .order('name', { ascending: true });

        if (teamsError) {
          throw teamsError;
        }

        setTeams(teamsData ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchOrganizationDetails();
  }, [orgId]);

  const handleBackToOrganizations = () => {
    navigate('/organizations');
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!organization && !loading && !error && <p>Organization not found.</p>}

      {organization && (
        <>
          <button type="button" onClick={handleBackToOrganizations}>
            Back to Organizations
          </button>

          <h2>{organization.name}</h2>

          <p>
            <Link to={`/organizations/${organization.id}/teams/new`}>Create Team</Link>
          </p>

          <h3>Teams</h3>

          {teams.length === 0 && !loading && <p>No teams found for this organization.</p>}

          {teams.map((team) => (
            <div key={team.id}>
              <h4>
                <Link to={`/organizations/${organization.id}/teams/${team.id}`}>{team.name}</Link>
              </h4>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrganizationDetailPage;
