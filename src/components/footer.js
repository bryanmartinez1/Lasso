// import {
//     Facebook,
//     Instagram,
//     MailOutline,
//     Phone,
//     Pinterest,
//     Room,
//     Twitter,
//   } from "@material-ui/icons";
import styled from "styled-components";
import React from "react";

//   import { mobile } from "../responsive";

const Container = styled.div`
  display: flex;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.h1``;

const Desc = styled.p`
  margin: 20px 0px;
`;

const SocialContainer = styled.div`
  display: flex;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  width: 50%;
  margin-bottom: 10px;
`;

const Right = styled.div`
  flex: 1;
  padding: 20px;
`;

const ContactItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Payment = styled.img`
  width: 50%;
`;

const Footer = () => {
  return (
    <Container style={{ backgroundColor: "#362419", color: "white" }}>
      <Left>
        <Logo>LASSO</Logo>
        <Desc>
          Lasso is guided by four principles: customer obsession rather than
          competitor focus, passion for invention, commitment to operational
          excellence, and long-term thinking. Lasso strives to be Earth’s most
          customer-centric company, Earth’s best employer, and Earth’s safest
          place to work.
        </Desc>
        {/* <SocialContainer>
            <SocialIcon color="3B5999">
              <Facebook />
            </SocialIcon>
            <SocialIcon color="E4405F">
              <Instagram />
            </SocialIcon>
            <SocialIcon color="55ACEE">
              <Twitter />
            </SocialIcon>
            <SocialIcon color="E60023">
              <Pinterest />
            </SocialIcon>
          </SocialContainer> */}
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
          <ListItem>Careers</ListItem>
          <ListItem>Policies</ListItem>
          <ListItem>License</ListItem>
          <ListItem>Customer Service</ListItem>
          <ListItem>Buy</ListItem>
          <ListItem>Sell</ListItem>
          <ListItem>Bidding</ListItem>
          <ListItem>Membership</ListItem>
          <ListItem>Registration</ListItem>
        </List>
      </Center>
      <Right>
        <Title>Contact</Title>
        <List>
          <ListItem> Facebook </ListItem>
          <ListItem> Instagram </ListItem>
          <ListItem> Twitter </ListItem>
        </List>
      </Right>
    </Container>
  );
};

export default Footer;
