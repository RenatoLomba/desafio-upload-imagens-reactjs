import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface GetImagesParams {
  pageParam?: number;
}

interface GetImagesResponse {
  data: {
    title: string;
    description: string;
    url: string;
    ts: number;
    id: string;
  }[];
  after?: number;
}

async function getImages({
  pageParam = null,
}: GetImagesParams): Promise<GetImagesResponse> {
  const { data } = await api.get<GetImagesResponse>('/api/images', {
    params: { after: pageParam },
  });

  return data;
}

function getNextPageParam(data: GetImagesResponse): number | null {
  return data.after;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    getImages, // TODO AXIOS REQUEST WITH PARAM
    { getNextPageParam } // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    return data?.pages?.map(page => page.data)?.flat(1) || [];
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button mt="40px" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
