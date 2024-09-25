import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi2";

import { Flag } from "../../ui/Flag";

import CreateGuestForm from "./CreateGuestForm";

import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteGuest } from "./useDeleteGuest";

const GuestId = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-500);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const NationalId = styled.div`
  font-weight: 500;
  color: var(--color-grey-600);
`;

function GuestRow({ guest }) {
  const { isDeleting, deleteGuest } = useDeleteGuest();

  const {
    id: guestId,
    fullName,
    email,
    nationalID,
    nationality,
    countryFlag,
  } = guest;

  return (
    <Table.Row>
      <GuestId>{guestId}</GuestId>
      <Stacked>
        <span>{fullName}</span>
        <span>{email}</span>
      </Stacked>
      <NationalId>{nationalID}</NationalId>
      <NationalId>{nationality}</NationalId>
      {countryFlag && <Flag src={countryFlag} alt={`Flag of ${nationality}`} />}

      {/* Context menu for managing each guest */}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={guestId} />
            <Menus.List id={guestId}>
              {/* Button to open the modal for editing  */}
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {/* Button to open the modal for deleting  */}
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            {/* Modal windows for edit and delete */}
            <Modal.Window name="edit">
              <CreateGuestForm guestToEdit={guest} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="guest"
                disabled={isDeleting}
                onConfirm={() => deleteGuest(guestId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default GuestRow;
