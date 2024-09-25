import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

import GuestRow from "./GuestRow";

import { useGuests } from "./useGuests";

function GuestsTable() {
  const { isLoading, guests, count } = useGuests();

  if (isLoading) return <Spinner />;

  if (!guests.length) return <Empty resourceName="guests" />;

  return (
    <Menus>
      <Table columns="0.6fr 2.4fr 1.4fr 1fr 0.5fr 3.2rem">
        <Table.Header>
          <div>ID</div>
          <div>Guest</div>
          <div>National ID</div>
          <div>Nationality</div>
          <div>Flag</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={guests}
          render={guest => <GuestRow key={guest.id} guest={guest} />}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default GuestsTable;
