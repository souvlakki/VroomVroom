import { useEffect, useState } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-react';
import { useParams, useNavigate } from 'react-router-dom';

const OrganizationDetailPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [organization, setOrganization] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizationDetails();
  }, [orgId]);

  const fetchOrganizationDetails = async () => {
    try {
      const { data: orgData, error: orgError } = await supabaseClient
        .from('organizations')
        .select('*')
        .eq('id', parseInt(orgId))
        .single();

      if (orgError) throw orgError;

      setOrganization(orgData);

      const { data: teamsData, error: teamsError } = await supabaseClient
        .from('teams')
        .select('*')
        .eq('org_id', orgData.id);

      if (teamsError) throw teamsError;

      setTeams(teamsData);
    } catch (err) {
      setError(err.message);
      navigate('/organizations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!organization && !loading && <p>Organization not found.</p>}
      {organization && (
        <>
          <h2>{organization.name}</h2>
          {/* Add more details as needed */}
          <h3>Teams</h3>
          {teams.length === 0 && !loading && <p>No teams found for this organization.</p>}
          {teams.map((team) => (
            <div key={team.id}>
              <h4>{team.name}</h4>
              {/* Add more details as needed */}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrganizationDetailPage;
