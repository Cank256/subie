import {
  Container,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { z } from "zod"

import { SubscriptionsService } from "../../client/index.ts"
import ActionsMenu from "../../components/Common/ActionsMenu.tsx"
import Navbar from "../../components/Common/Navbar.tsx"
import AddSubscription from "../../components/Subscription/AddSubscription.tsx"
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx"

const subscriptionsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/items")({
  component: Subscriptions,
  validateSearch: (search) => subscriptionsSearchSchema.parse(search),
})

const PER_PAGE = 5

function getSubscriptionsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      SubscriptionsService.readSubscriptions({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["subscriptions", { page }],
  }
}

function SubscriptionsTable() {
  const queryClient = useQueryClient()
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({ search: (prev: {[key: string]: string}) => ({ ...prev, page }) })

  const {
    data: subscriptions,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getSubscriptionsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && subscriptions?.data.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getSubscriptionsQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(4).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {subscriptions?.data.map((subscription) => (
                <Tr key={subscription.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td>{subscription.id}</Td>
                  <Td isTruncated maxWidth="150px">
                    {subscription.title}
                  </Td>
                  <Td
                    color={!subscription.description ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {subscription.description || "N/A"}
                  </Td>
                  <Td>
                    <ActionsMenu type={"Subscription"} value={subscription} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  )
}

function Subscriptions() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Subscriptions Management
      </Heading>

      <Navbar type={"Subscription"} addModalAs={AddSubscription} />
      <SubscriptionsTable />
    </Container>
  )
}
