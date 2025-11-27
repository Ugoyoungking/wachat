'use server';

/**
 * @fileOverview Flow for creating and customizing an AI bot with specific instructions and data.
 *
 * - createCustomAI - A function that handles the creation and customization of an AI bot.
 * - CreateCustomAIInput - The input type for the createCustomAI function.
 * - CreateCustomAIOutput - The return type for the createCustomAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateCustomAIInputSchema = z.object({
  name: z.string().describe('The name of the custom AI bot.'),
  instructions: z.string().describe('Specific instructions for the AI bot.'),
  data: z.string().optional().describe('Additional data for the AI bot.'),
});
export type CreateCustomAIInput = z.infer<typeof CreateCustomAIInputSchema>;

const CreateCustomAIOutputSchema = z.object({
  success: z.boolean().describe('Indicates if the custom AI bot was created successfully.'),
  message: z.string().describe('A message indicating the status of the creation process.'),
});
export type CreateCustomAIOutput = z.infer<typeof CreateCustomAIOutputSchema>;

export async function createCustomAI(input: CreateCustomAIInput): Promise<CreateCustomAIOutput> {
  return createCustomAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createCustomAIPrompt',
  input: {schema: CreateCustomAIInputSchema},
  output: {schema: CreateCustomAIOutputSchema},
  prompt: `You are an AI bot creation assistant. Your task is to create a custom AI bot based on the provided instructions and data.

Name: {{{name}}}
Instructions: {{{instructions}}}
Data: {{{data}}}

Determine whether the custom AI bot was created successfully based on the input parameters, and return an output with success boolean and appropriate status message.`, 
});

const createCustomAIFlow = ai.defineFlow(
  {
    name: 'createCustomAIFlow',
    inputSchema: CreateCustomAIInputSchema,
    outputSchema: CreateCustomAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
