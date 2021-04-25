import { useDisclosure } from "@chakra-ui/hooks";
import { Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useEffect } from "react";
import useUser from "../../lib/useUser";
import EditUser from "../EditUser/EditUser";

export default function CompleteUserInformation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading, error, checkSession } = useUser();

  useEffect(() => {
    if (
      (!user.name || !user.email || !user.phoneNumber) &&
      user &&
      !isLoading &&
      !error
    ) {
      onOpen();
    }
  }, [user, isLoading, error, onOpen]);

  return (
    <Modal
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={() => null}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete User Information</ModalHeader>
        <ModalBody pb={5}>
          <Text>
            Please fill out the remaining Information regarding your Track and
            Trace contact details
          </Text>
          <EditUser
            user={user}
            onFinish={async (user) => {
              await checkSession();
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
