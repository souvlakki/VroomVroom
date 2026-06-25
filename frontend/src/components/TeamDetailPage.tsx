import { useEffect, useState } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-react';
import { useParams, useNavigate } from 'react-router-dom';

const TeamDetailPage = () => {
  const { orgId, teamId } = useParams<{ orgId: string; teamId: string }>();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamDetails();
  }, [orgId, teamId]);

  const fetchTeamDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('teams')
        .select('*')
        .eq('id', parseInt(teamId))
        .single();

      if (error) throw error;

      setTeam(data);
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
      {!team && !loading && <p>Team not found.</p>}
      {team && (
        <>
          <h2>{team.name}</h2>
          {/* Add more details as needed */}
        </>
      )}
    </div>
  );
};

export default TeamDetailPage;
