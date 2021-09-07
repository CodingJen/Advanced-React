import { useCombobox, useSelect } from 'downshift';
import styled from 'styled-components';

const ComboBoxStyles = styled.div`
  padding-left: 1rem;
  position: relative;
  margin: 0;
  border: 1px solid black;
  font-size: 1rem;
  font-weight: normal !important;
`;

const MenuStyles = styled.ul`
  position: absolute;
  max-height: 180px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  z-index: 2;
`;

const MenuItemStyles = styled.li`
  padding: 1rem;
  background: white;
  border-bottom: 1px solid var(--lightGray);
`;

const DropDownButton = styled.div`
  display: inline-block;
  background: var(--lightGray);
  border: 1px solid lightgray;
  padding: 0.5rem;
  cursor: pointer;
`;

const SelectorRowStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

function formatToSingleLineAddress(address) {
  return `${address.name} - ${address.line1}, ${address.line2 || ''} ${
    address.city
  }, ${address.province} ${address.country}`;
}

export default function AddressDropdown({ addresses }) {
  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    getLabelProps,
    getToggleButtonProps,
    highlightedIndex,
  } = useSelect({
    items: addresses,
  });

  return (
    <div>
      <label {...getLabelProps()}>Address</label>

      <ComboBoxStyles>
        <SelectorRowStyles>
          <span>
            {selectedItem
              ? formatToSingleLineAddress(selectedItem)
              : 'Current Address here...'}
          </span>
          <DropDownButton
            role="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
          >
            &#8595;
          </DropDownButton>
        </SelectorRowStyles>

        <MenuStyles {...getMenuProps()}>
          {isOpen &&
            addresses.map((address, index) => (
              <MenuItemStyles
                key={`${address.id}${index}`}
                style={
                  highlightedIndex === index
                    ? { backgroundColor: 'lightGray' }
                    : {}
                }
                {...getItemProps({ item: address.name, index })}
              >
                {formatToSingleLineAddress(address)}
              </MenuItemStyles>
            ))}
        </MenuStyles>
      </ComboBoxStyles>
    </div>
  );
}
