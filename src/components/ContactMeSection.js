import React, {useEffect} from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import * as Yup from 'yup';
import FullScreenSection from "./FullScreenSection";
import useSubmit from "../hooks/useSubmit";
import {useAlertContext} from "../context/alertContext";

const LandingSection = () => {
  const {isLoading, response, submit} = useSubmit();
  const { onOpen,onClose } = useAlertContext();

  const formik = useFormik({
    initialValues: {
      firstName:"",
      email:"",
      type:"Freelance project proposal",
      comment:"",
    },
    onSubmit: (values) => {
      submit('https://john.com/contactme', values);
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter your First Name"),
      email: Yup.string().email("Invalid Email-ID").required("Please Enter an Email-ID"),
      comment: Yup.string().required("Please Enter Your Comment").min(25,"Enter minimum 25 characters"),
    }),
  });

  useEffect(() => { 
    if (response) { 
      onOpen(response.type, response.message); 
      
      if (response.type === 'success') { 
        // formik.resetForm(); 
      } 
      
    } 
},[response,onOpen]); 

  return (
    <FullScreenSection
      py={16}
      spacing={8}
      id="contactme-section"
      w="100%"
    >
      <VStack className="contactForm" alignItems="flex-start"
        onSubmit={formik.handleSubmit}>
        <Heading as="h1" >
          Contact me
        </Heading>
        <Box p={6} rounded="md" w="100%">
          <form>
            <VStack spacing={4}>
              <FormControl isInvalid={formik.errors.firstName && formik.touched.firstName}>
                <FormLabel htmlFor="firstName">Name</FormLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  // onChange={formik.handleChange}
                  // value={formik.values.firstName}
                  // onBlur={formik.handleBlur}
                  {...formik.getFieldProps("firstName")}
                />
                <FormErrorMessage name="firstName">{formik.errors.firstName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.email && formik.touched.email}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  // onChange={formik.handleChange}
                  // value={formik.values.email}
                  // onBlur={formik.handleBlur}
                  {...formik.getFieldProps("email")}
                />
                <FormErrorMessage name="email">{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="type">Type of enquiry</FormLabel>
                <Select id="type" name="type">
                  <option value="hireMe">Freelance project proposal</option>
                  <option value="openSource">
                    Open source consultancy session
                  </option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              <FormControl isInvalid={formik.errors.comment && formik.touched.comment}>
                <FormLabel htmlFor="comment">Your message</FormLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  height={250}
                  // onChange={formik.handleChange}
                  // value={formik.values.comment}
                  // onBlur={formik.handleBlur}
                  {...formik.getFieldProps("comment")}
                />
                <FormErrorMessage name="comment">{formik.errors.comment}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="purple" width="full" isLoading={isLoading}>
                Submit  
                {/* {isLoading && <Spinner thickness='2px' spacing={4} marginLeft={2}></Spinner>} */}
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </FullScreenSection>
  );
};

export default LandingSection;
