import Logo from "../assets/logo.svg";
import { Container, Image } from "./HeaderStylesStyles";

export function Header() {
  return (
    <Container>
      <Image src={Logo} alt="Logotipo" />
    </Container>
  );
}
