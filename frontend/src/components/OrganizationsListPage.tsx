import { useEffect, useState } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-react';

const OrganizationsListPage = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabaseClient.from('organizations').select('*');
      if (error) throw error;
      setOrganizations(data);
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
      {organizations.length === 0 && !loading && <p>No organizations found.</p>}
      {organizations.map((org) => (
        <div key={org.id}>
          <h2>{org.name}</h2>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

export default OrganizationsListPage;
