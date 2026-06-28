import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Organization = {
  id: number;
  name: string;
};

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'An unknown error occurred.';

const CreateOrganizationPage = () => {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Organization name is required.');
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

      const { data: organization, error: organizationError } = await supabase
        .from('organizations')
        .insert([{ name: trimmedName }])
        .select('id, name')
        .single<Organization>();

      if (organizationError) {
        throw organizationError;
      }

      const { error: membershipError } = await supabase
        .from('organization_members')
        .insert([
          {
            user_id: user.id,
            org_id: organization.id,
            role: 'admin',
          },
        ]);

      if (membershipError) {
        throw membershipError;
      }

      navigate(`/organizations/${organization.id}`);
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
        placeholder="Organization Name"
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Organization'}
      </button>
    </form>
  );
};

export default CreateOrganizationPage;
