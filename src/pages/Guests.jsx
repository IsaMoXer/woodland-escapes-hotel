import AddGuest from "../features/guests/AddGuest";
import GuestsTable from "../features/guests/GuestsTable";

import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Guests() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All guests</Heading>
        {/* <GuestTableOperations /> */}
      </Row>

      <GuestsTable />
      <AddGuest />
    </>
  );
}

export default Guests;
