import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Organization = {
  id: number;
  name: string;
};

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'An unknown error occurred.';

const OrganizationsListPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: organizationsError } = await supabase
          .from('organizations')
          .select('id, name')
          .order('name', { ascending: true });

        if (organizationsError) {
          throw organizationsError;
        }

        setOrganizations(data ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchOrganizations();
  }, []);

  return (
    <div>
      <h1>Organizations</h1>

      <p>
        <Link to="/organizations/new">Create Organization</Link>
      </p>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {organizations.length === 0 && !loading && !error && <p>No organizations found.</p>}

      {organizations.map((org) => (
        <div key={org.id}>
          <h2>
            <Link to={`/organizations/${org.id}`}>{org.name}</Link>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default OrganizationsListPage;
