import { AnimatePresence, motion } from "framer-motion";
import { H3 } from "@/components/typography";

type Props = { isOpen: boolean };

export const SidebarLogo = (props: Props) => {
  return (
    <AnimatePresence mode={"popLayout"}>
      {props.isOpen ? (
        <motion.div animate={{ width: "fit-content" }} exit={{ width: 0 }}>
          <Logo />
        </motion.div>
      ) : (
        <motion.div animate={{ width: "fit-content" }} exit={{ width: 0 }}>
          <LogoMin />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Logo = () => {
  return <H3 className={"whitespace-nowrap"}>| logan |</H3>;
};

const LogoMin = () => {
  return <H3>| l |</H3>;
};
