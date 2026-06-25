import { useEffect, useState } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-react';
import { useParams, useNavigate } from 'react-router-dom';

const TeamsListPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [orgId]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('teams')
        .select('*')
        .eq('org_id', parseInt(orgId));

      if (error) throw error;

      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {teams.length === 0 && !loading && <p>No teams found for this organization.</p>}
      {teams.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

export default TeamsListPage;
