import React, { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/configureStore";
import { paletteSelectors } from "../../store/features/entities/entitiesState";
import PaletteBlock from "../library/PaletteBlock";
import { SelectMenu, selectMenuStyleProps } from "../ui/form/Select";
import { RelativePortal } from "../ui/layout/RelativePortal";
import { PaletteSelect } from "./PaletteSelect";

type PaletteSelectProps = {
  name: string;
  value?: string;
  type?: "tile" | "sprite";
  onChange?: (newId: string) => void;
  optional?: boolean;
  optionalLabel?: string;
  optionalDefaultPaletteId?: string;
};

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const Button = styled.button`
  background: ${(props) => props.theme.colors.input.background};
  color: ${(props) => props.theme.colors.input.text};
  border: 1px solid ${(props) => props.theme.colors.input.border};
  font-size: ${(props) => props.theme.typography.fontSize};
  border-radius: ${(props) => props.theme.borderRadius}px;
  padding: 1px;
  box-sizing: border-box;
  height: 28px;

  :hover {
    background: ${(props) => props.theme.colors.input.hoverBackground};
  }

  :focus,
  &&&:focus:not(.focus-visible) {
    border: 1px solid ${(props) => props.theme.colors.highlight};
    background: ${(props) => props.theme.colors.input.activeBackground};
    box-shadow: 0 0 0px 2px ${(props) => props.theme.colors.highlight} !important;
  }
`;

const NoValue = styled.div`
  width: 24px;
`;

export const PaletteSelectButton: FC<PaletteSelectProps> = ({
  value,
  type,
  onChange,
  optional,
  optionalLabel,
  optionalDefaultPaletteId,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const palette = useSelector((state: RootState) =>
    paletteSelectors.selectById(state, value || optionalDefaultPaletteId || "")
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [buttonFocus, setButtonFocus] = useState<boolean>(false);

  useEffect(() => {
    if (buttonFocus) {
      window.addEventListener("keydown", onKeyDownClosed);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDownClosed);
    };
  }, [buttonFocus]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", onKeyDownOpen);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDownOpen);
    };
  }, [isOpen]);

  const onKeyDownClosed = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      setIsOpen(true);
    }
  };

  const onKeyDownOpen = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const onSelectChange = (newValue: string) => {
    closeMenu();
    onChange?.(newValue);
    buttonRef.current?.focus();
  };

  const onButtonFocus = () => {
    setButtonFocus(true);
  };

  const onButtonBlur = () => {
    setButtonFocus(false);
  };

  return (
    <Wrapper>
      <Button
        ref={buttonRef}
        onClick={toggleMenu}
        onFocus={onButtonFocus}
        onBlur={onButtonBlur}
      >
        {palette ? (
          <PaletteBlock type={type} colors={palette?.colors || []} size={22} />
        ) : (
          <NoValue />
        )}
      </Button>
      <RelativePortal pin="top-right" offsetY={28}>
        {isOpen && (
          <SelectMenu>
            <PaletteSelect
              name={name}
              value={value}
              type={type}
              onChange={onSelectChange}
              onBlur={closeMenu}
              optional={optional}
              optionalLabel={optionalLabel}
              optionalDefaultPaletteId={optionalDefaultPaletteId}
              {...selectMenuStyleProps}
            />
          </SelectMenu>
        )}
      </RelativePortal>
    </Wrapper>
  );
};