import { v4 as uuid } from "uuid";
import type {
  ReceiptItemAssignmentForm,
  ReceiptItemForm,
  ReceiptMember,
} from "~~/types/receipts";
import { distributeAmountEvenly } from "~~/utils/currency";

export const useMemberAssignment = () => {
  /**
   * Assigns or removes members from a receipt item based on selected members
   * @param currentItem - The current receipt item
   * @param selectedMembers - Array of members that are currently selected/checked
   * @returns Updated receipt item with new assignments
   */
  const assignMembersToItem = (
    currentItem: ReceiptItemForm,
    selectedMembers: ReceiptMember[]
  ): ReceiptItemForm => {
    const numAssignments = selectedMembers.length;
    const distributedValues = distributeAmountEvenly(
      currentItem.cost,
      numAssignments
    );

    const newAssignments: ReceiptItemAssignmentForm[] = selectedMembers.map(
      (member, index) => ({
        id: uuid(),
        user_name: member.name,
        method: "percent",
        value: distributedValues[index] || 0,
      })
    );

    // Return updated item with the new assignments
    return {
      ...currentItem,
      assignments: newAssignments,
    };
  };

  /**
   * Assigns specific members to a receipt item (for use in dropdowns/UI)
   * @param currentItem - The current receipt item
   * @param membersToAssign - Array of member names to assign
   * @returns Updated receipt item with new assignments
   */
  const assignSpecificMembers = (
    currentItem: ReceiptItemForm,
    membersToAssign: string[]
  ): ReceiptItemForm => {
    const newAssignments: ReceiptItemAssignmentForm[] = membersToAssign.map(
      (memberName) => ({
        id: uuid(),
        user_name: memberName,
        method: "equal",
        value: 0,
      })
    );

    return {
      ...currentItem,
      assignments: newAssignments,
    };
  };

  /**
   * Removes specific members from a receipt item
   * @param currentItem - The current receipt item
   * @param membersToRemove - Array of member names to remove
   * @returns Updated receipt item with members removed
   */
  const removeMembersFromItem = (
    currentItem: ReceiptItemForm,
    membersToRemove: string[]
  ): ReceiptItemForm => {
    const currentAssignments = currentItem.assignments || [];
    const newAssignments = currentAssignments.filter(
      (assignment) => !membersToRemove.includes(assignment.user_name)
    );

    return {
      ...currentItem,
      assignments: newAssignments,
    };
  };

  /**
   * Toggles members for a receipt item - adds if not assigned, removes if assigned
   * @param currentItem - The current receipt item
   * @param selectedMembers - Array of members that are currently selected/checked
   * @returns Updated receipt item with toggled assignments
   */
  const toggleMembersForItem = (
    currentItem: ReceiptItemForm,
    selectedMembers: ReceiptMember[]
  ): ReceiptItemForm => {
    const currentAssignments = currentItem.assignments || [];
    const selectedMemberNames = selectedMembers.map((m) => m.name);

    // Get currently assigned member names
    const currentlyAssignedNames = currentAssignments.map((a) => a.user_name);

    // Start with current assignments
    let newAssignments = [...currentAssignments];

    // For each selected member, toggle their assignment
    selectedMembers.forEach((member) => {
      const isCurrentlyAssigned = currentlyAssignedNames.includes(member.name);

      if (isCurrentlyAssigned) {
        // Remove the member if they're currently assigned
        newAssignments = newAssignments.filter(
          (assignment) => assignment.user_name !== member.name
        );
      } else {
        // Add the member if they're not currently assigned
        newAssignments.push({
          id: uuid(),
          user_name: member.name,
          method: "percent",
          value: 0, // Will be calculated by splitEvenly
        });
      }
    });

    // Note: Unselected members are left unchanged in their current assignment state
    // The actual splitting will be handled by the splitEvenly function
    // in the edit drawer or wherever this is used. This function just handles
    // the toggle logic of adding/removing selected members.

    return {
      ...currentItem,
      assignments: newAssignments,
    };
  };

  return {
    assignMembersToItem,
    assignSpecificMembers,
    removeMembersFromItem,
    toggleMembersForItem,
  };
};
